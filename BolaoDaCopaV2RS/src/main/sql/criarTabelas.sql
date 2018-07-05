create table Usuario
(
    id integer not null generated always as identity (start with 1, increment by 1),
    nome varchar(256) not null,
    email varchar(256) not null,
    senha varchar(256) not null,
    telefone varchar(24) not null,
    dataDeNascimento date,
    CONSTRAINT primary_key PRIMARY KEY (id)
);

create table Palpite
(
    id integer not null generated always as identity (start with 1, increment by 1),
    campeao varchar(256) not null,
    vice varchar(256) not null,
    palpiteiro integer references Usuario (id)
);

CREATE TABLE Pais
(
    nome VARCHAR(256) NOT NULL,
    CONSTRAINT pk_pais PRIMARY KEY (nome)
);