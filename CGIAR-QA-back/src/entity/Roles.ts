import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { QAPermissions } from "../entity/Permissions";
// import { QAPermissions } from "@entity/Permissions";


@Entity()
export class QARoles {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(3, 50)
    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;


    @Column()
    @Length(3, 10)
    @IsNotEmpty({ message: 'Acronym is required' })
    acronym: string;

    @Column({
        default: true
    })
    is_active: boolean;


    @ManyToMany(type => QAPermissions, {
        eager: true
    })
    // @ManyToOne(type => QAPermissions, permission => permission.id)
    @JoinTable({
        name: "qa_roles_permissions", // table name for the junction table of this relation
        joinColumn: {
            name: "qa_role",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "qa_permissions",
            referencedColumnName: "id"
        }
    })
    permissions: QAPermissions[];

}
