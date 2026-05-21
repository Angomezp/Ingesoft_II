import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("localidades")
export class Localidades {
    
    @PrimaryColumn({name : "nombrecompleto", type : "varchar", length : 40})
    NombreCompleto!: string;

    @Column({name : "abreviacionciudad", type : "varchar", length : 10})
    AbreviacionCiudad!: string;
}