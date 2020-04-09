import { Request, Response } from "express";
import { validate, validateOrReject } from "class-validator";
import { getRepository, In, getConnection, QueryRunner } from "typeorm";

import { QAUsers } from "@entity/User";
import { QARoles } from "@entity/Roles";
import { QACrp } from "@entity/CRP";
import { QAComments } from "@entity/Comments";
import { QACommentsMeta } from "@entity/CommentsMeta";

import Util from "@helpers/Util"
import { QACommentsReplies } from "@entity/CommentsReplies";
import { RolesHandler } from "@helpers/RolesHandler";
import { QAIndicatorsMeta } from "@entity/IndicatorsMeta";
import { QAEvaluations } from "@entity/Evaluations";

class CommentController {


    static commentsCount = async (req: Request, res: Response) => {
        const { crp_id, id } = req.query;
        let queryRunner = getConnection().createQueryBuilder();
        try {

            if (crp_id) {
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    `SELECT
                        evaluations.indicator_view_name,
                        (
                            SELECT
                                COUNT(DISTINCT id)
                            FROM
                                qa_comments
                            WHERE
                                qa_comments.evaluationId = evaluations.id
                        ) AS count,
                        indicators.id,
                        indicators.primary_field,
                        comments_meta.enable_crp,
                        comments_meta.enable_assessor
                    FROM
                        qa_evaluations evaluations
                    LEFT JOIN qa_indicators indicators ON indicators.view_name = evaluations.indicator_view_name
                    LEFT JOIN qa_comments_meta comments_meta ON comments_meta.indicatorId = indicators.id
                    WHERE
                        evaluations.crp_id = :crp_id
                        `,
                    { crp_id },
                    {}
                );
                let rawData = await queryRunner.connection.query(query, parameters);
                res.status(200).json({ data: Util.parseCommentData(rawData, 'indicator_view_name'), message: 'Comments by crp' });
            }
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not access to evaluations." });
        }

        // console.log( crp_id, id)
        // res.status(200).send()
    }

    // create reply by comment
    static createCommentReply = async (req: Request, res: Response) => {

        //Check if username and password are set
        const { detail, userId, commentId, crp_approved, approved } = req.body;
        // const evaluationId = req.params.id;

        const userRepository = getRepository(QAUsers);
        const commentReplyRepository = getRepository(QACommentsReplies);
        const commentsRepository = getRepository(QAComments);

        try {

            let user = await userRepository.findOneOrFail({ where: { id: userId } });
            let comment = await commentsRepository.findOneOrFail({ where: { id: commentId } });
            let reply = new QACommentsReplies();
            reply.detail = detail;
            reply.comment = comment;
            reply.user = user;

            let new_replay = await commentReplyRepository.save(reply);
            if (user.roles.find(x => x.description == RolesHandler.crp)) {
                comment.crp_approved = crp_approved;
                comment = await commentsRepository.save(comment);
            }
            // else if(user.roles.find(x => x.description == RolesHandler.admin)){
            //     comment.approved = approved;
            //     comment = await commentsRepository.save(comment);
            // }
            // console.log(new_replay)
            res.status(200).send({ data: new_replay, message: 'Comment created' });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Comment can not be created.", data: error });
        }
    }

    // create comment by indicator
    static createComment = async (req: Request, res: Response) => {

        //Check if username and password are set
        const { detail, approved, userId, metaId, evaluationId } = req.body;
        // const evaluationId = req.params.id;

        const userRepository = getRepository(QAUsers);
        const metaRepository = getRepository(QAIndicatorsMeta);
        const evaluationsRepository = getRepository(QAEvaluations);
        const commentsRepository = getRepository(QAComments);

        try {

            let user = await userRepository.findOneOrFail({ where: { id: userId } });
            let meta = await metaRepository.findOneOrFail({ where: { id: metaId } });
            let evaluation = await evaluationsRepository.findOneOrFail({ where: { id: evaluationId } });

            let comment_ = new QAComments();
            comment_.detail = detail;
            comment_.approved = approved;
            comment_.meta = meta;
            comment_.evaluation = evaluation;
            comment_.user = user;

            let new_comment = await commentsRepository.save(comment_);

            res.status(200).send({ data: new_comment, message: 'Comment created' });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Comment can not be created.", data: error });
        }
    }

    // update comment by indicator
    static updateComment = async (req: Request, res: Response) => {

        //Check if username and password are set
        const { approved, is_visible, is_deleted, id } = req.body;
        const commentsRepository = getRepository(QAComments);

        try {
            let comment_ = await commentsRepository.findOneOrFail(id);
            comment_.approved = approved;
            comment_.is_deleted = is_deleted;
            comment_.is_visible = is_visible;


            let updated_comment = await commentsRepository.save(comment_);

            res.status(200).send({ data: updated_comment, message: 'Comment created' });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Comment can not be created.", data: error });
        }
    }

    // get comments by indicator
    static getComments = async (req: Request, res: Response) => {
        const evaluationId = req.params.evaluationId;
        const metaId = req.params.metaId;

        const commentsRepository = getRepository(QAComments);
        let queryRunner = getConnection().createQueryBuilder();
        try {
            const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                `SELECT
                id, (
                    SELECT
                        COUNT(DISTINCT id)
                    FROM
                        qa_comments_replies
                    WHERE
                        commentId = qa_comments.id
                ) AS replies_count
                FROM
                    qa_comments
                WHERE
                    metaId = :metaId
                AND evaluationId = :evaluationId
                `,
                { metaId, evaluationId },
                {}
            );
            let replies = await queryRunner.connection.query(query, parameters);
            let comments = await commentsRepository.find({
                where: {
                    meta: metaId, evaluation: evaluationId
                }, 
                relations: ['user'],
                order: {
                    createdAt: "ASC"
                }
            });
            for (let index = 0; index < comments.length; index++) {
                const comment = comments[index];
                comment.replies = replies.find(reply => reply.id == comment.id)
            }
            res.status(200).send({ data: comments, message: 'Comments' });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Comment can not be retrived.", data: error });
        }

    }

    // get comments replies
    static getCommentsReplies = async (req: Request, res: Response) => {
        const commentId = req.params.commentId;

        let queryRunner = getConnection().createQueryBuilder();
        try {
            let replies = await getRepository(QACommentsReplies).find(
                {
                    where: [{
                        comment: commentId
                    }],
                    relations: ['user']
                }
            )
            res.status(200).send({ data: replies, message: 'Comments' });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Comment can not be retrived.", data: error });
        }
    }

    //edit comment meta data
    static editCommentsMeta = async (req: Request, res: Response) => {

        //Get the ID from the url
        const id = req.params.id;

        let { enable, isActive } = req.body;

        const commentMetaRepository = getRepository(QACommentsMeta);
        let commentMeta, updatedCommentMeta;

        try {
            commentMeta = await commentMetaRepository.createQueryBuilder('qa_comments_meta')
                .select('id, enable_crp, enable_assessor')
                .where("qa_comments_meta.indicatorId=:indicatorId", { indicatorId: id })
                // .getSql()
                .getRawOne()
            // console.log(commentMeta, enable, isActive)
            commentMeta[enable] = isActive;
            // console.log(commentMeta, 'after')

            //Validade if the parameters are ok
            const errors = await validate(commentMeta);
            if (errors.length > 0) {
                res.status(400).json({ data: errors, message: "Error found" });
                return;
            }

            // update indicator by user
            commentMeta = await commentMetaRepository.save(commentMeta);
            // console.log(commentMeta)

        } catch (error) {
            console.log(error)
            //If not found, send a 404 response
            res.status(404).json({ message: 'User indicator not found.', data: error });
            // throw new ErrorHandler(404, 'User not found.');
        }

        //If all ok, send 200 response
        res.status(200).json({ message: "User indicator updated", data: commentMeta });


    };

}

export default CommentController;