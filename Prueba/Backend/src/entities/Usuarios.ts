import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("usuarios")
export class Usuarios {
    @PrimaryColumn({name : "NombreUsuario", type : "varchar", length : 20})
    NombreUsuario!: string;

    @Column({name : "Identificacion", type : "varchar", length : 20})
    Identificacion!: string;

    @Column({name : "NombreCompleto", type : "varchar", length : 40})
    NombreCompleto!: string;

}