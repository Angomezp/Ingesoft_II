import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("usuarios")
export class Usuarios {
    // Map entity fields to lowercase column names to match common DB schemas
    @PrimaryColumn({ name: "nombreusuario", type: "varchar", length: 20 })
    NombreUsuario!: string;

    @Column({ name: "identificacion", type: "varchar", length: 20, nullable: true })
    Identificacion!: string;

    @Column({ name: "nombrecompleto", type: "varchar", length: 40, nullable: true })
    NombreCompleto!: string;

}