import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";

import { QAComments } from "./Comments";

@Entity()
export class QAReplyType {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        nullable: false
    })
    name: string;
    
    @OneToMany(type => QAComments, comment => comment.replyType)
    comments: QAComments;
} 