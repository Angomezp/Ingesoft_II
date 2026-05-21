import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("usuarios")
export class Usuarios {
    // Mapear campos a nombres de columna en minúsculas (coincidir BD)
    @PrimaryColumn({ name: "nombreusuario", type: "varchar", length: 20 })
    NombreUsuario!: string;

    @Column({ name: "identificacion", type: "varchar", length: 20, nullable: true })
    Identificacion!: string;

    @Column({ name: "nombrecompleto", type: "varchar", length: 40, nullable: true })
    NombreCompleto!: string;

}