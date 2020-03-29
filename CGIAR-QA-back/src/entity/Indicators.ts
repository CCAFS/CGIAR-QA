import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, OneToMany, OneToOne } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { QAIndicatorUser } from "../entity/IndicatorByUser";
import { QAIndicatorsMeta } from "../entity/IndicatorsMeta";
import { QACommentsMeta } from "../entity/CommentsMeta";
// import { QAIndicatorUser } from "@entity/IndicatorByUser";

@Entity()
@Unique(["name", "view_name"])
export class QAIndicators {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 200)
    @IsNotEmpty({ message: 'The name is required' })
    name: string;

    @Column()
    @Length(4, 200)
    description: string;

    @Column()
    @Length(1, 200)
    primary_field: string;

    @Column()
    @Length(4, 200)
    @IsNotEmpty({ message: 'The view name is required' })
    view_name: string;

    @OneToMany(type => QAIndicatorUser, indicators => indicators.indicator)
    user_indicator: QAIndicatorUser[];

    @OneToMany(type => QAIndicatorsMeta, meta => meta.indicator, { eager: true })
    meta: QAIndicatorsMeta[];

    @OneToOne(type => QACommentsMeta, comments_meta => comments_meta.indicator, { eager: true }) // specify inverse side as a second parameter
    comment_meta: QACommentsMeta;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}