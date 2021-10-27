import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class QAQuickComments {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        nullable: false
    })
    comment: string;
} 