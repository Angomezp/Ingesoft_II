import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("localidades")
export class Localidades {
    
    @PrimaryColumn({name : "NombreCompleto", type : "varchar", length : 40})
    NombreCompleto!: string;

    @Column({name : "AbreviacionCiudad", type : "varchar", length : 10})
    AbreviacionCiudad!: string;
}