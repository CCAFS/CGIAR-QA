import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

// import { QAPermissions } from "../entity/Permissions";
// import { RolesHandler } from "../_helpers/RolesHandler";

@Entity()
export class QATokenAuth {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'longtext' })
    @IsNotEmpty({ message: 'Token is required' })
    token: string;

    @Column(
        { nullable: true }
    )
    // @IsNotEmpty({ message: 'Expiration date is required' })
    expiration_date: Date;

    @Column()
    @Length(3, 10)
    @IsNotEmpty({ message: 'CRP is required' })
    crp_id: string;

    @Column()
    @Length(3, 10)
    username: string;

    @Column()
    @Length(3, 10)
    email: string;

    @Column()
    @Length(3, 10)
    name: string;

    @Column()
    @Length(3, 10)
    app_user: number;



}