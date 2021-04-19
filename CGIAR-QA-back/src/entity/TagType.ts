import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { QATags } from "../entity/Tags"

@Entity()
export class QATagType {

    @PrimaryGeneratedColumn()
    id: number;

    
    @Column({
        nullable: false
    })
    name: string;
    
    @OneToMany(type => QATags, tag => tag.tagType)
    tags: QATags;
}  