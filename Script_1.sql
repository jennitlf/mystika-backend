CREATE TABLE customer (
	id SERIAL PRIMARY KEY,
	name VARCHAR(60) not NULL default 'NaN',
	phone VARCHAR(15) not NULL default 'NaN',
	email VARCHAR(60) unique not NULL default 'NaN',
	password VARCHAR(255) not NULL default 'NaN',
	status VARCHAR(15) not null default 'ativo',	
	"role" VARCHAR(4) not null default 'user',
	created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp 
);

CREATE TABLE consultant(
	id SERIAL PRIMARY KEY,
	name VARCHAR(60) not NULL default 'NaN',
	cpf VARCHAR(11) not NULL default 'NaN',
	phone VARCHAR(15) not NULL default 'NaN',
	email VARCHAR(60) unique not null,
	password VARCHAR(255) not NULL default 'NaN',
	profile_data VARCHAR(800) not NULL default 'NaN',
	image_consultant VARCHAR(300) not NULL default 'NaN',
	status VARCHAR(15) not null default 'inativo',
	payment_plan VARCHAR(25) not null default 'mensal',
	appellant boolean not null default 'false',
	about_specialties VARCHAR(700) not NULL default 'NaN',
	consultants_story VARCHAR(700) not null default 'NaN',
	consultations_carried_out int not null default 100,
	"role" varchar(10) not null default 'consultant',
	created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp 
);

CREATE TABLE specialty(
	id SERIAL PRIMARY KEY,
	name VARCHAR(20) unique not null
);

CREATE TABLE CONSULTANT_SPECIALTY(
	id SERIAL PRIMARY KEY,
	id_consultant int not null,
	id_specialty int not null,
	duration int not null,
	value_per_duration int not null,
	FOREIGN KEY (id_consultant) REFERENCES CONSULTANT(id),
	FOREIGN KEY (id_specialty) REFERENCES SPECIALTY(id)
);
create table SCHEDULE_CONSULTANT(
	id SERIAL primary key,
	id_consultant_specialty int not null,
	"date" date not null,
	day_week INT,
	hour_initial time not null,
	hour_end time not null,
	status varchar(25) DEFAULT 'disponivel',
	foreign key (id_consultant_specialty) references consultant_specialty(id) 
);

create table schedule_exception(
	id SERIAL primary key,
	id_schedule_consultant int not null,
	date_exception date not null,
	day_week int not null,
	unavailable_time time not null,
	reason varchar(45),
	foreign key (id_schedule_consultant) references schedule_consultant(id)
);

create table adm(
	id serial primary key,
	name varchar(80) not null,
	email varchar(254) unique not null,
	password varchar(255) not null,
	"role" varchar(3) not NULL DEFAULT 'administrador',
	created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp 
);

create table customer_support(
	id serial primary key,
	id_customer int not null,
	email varchar(60) not null,
	phone varchar(15) not null,
	title varchar(100) not null,
	content varchar(300) not null,
	status varchar(30) not null default 'pending',
	adm_responsible int not null default 0,
	created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp, 
	foreign key (id_customer) references  customer(id) on delete cascade,
	foreign key (adm_responsible) references adm(id) on delete cascade
);

create table consultant_support(
	id serial primary key,
	id_consultant int not null,
	email varchar(60) not null,
	phone varchar(15) not null,
	title varchar(100) not null,
	content varchar(300) not null,
	status varchar(50) not null default 'pending',
	adm_responsible int not null default 0,
	created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp, 
	foreign key (id_consultant) references consultant(id) on delete cascade,
	foreign key (adm_responsible) references adm(id) on delete cascade
	
);

create table consultation (
	id serial primary key,
	id_customer int not null references customer(id) default 0,
	id_schedule_consultant int not null references schedule_consultant(id) default 0,
	appoinment_date date NOT NULL default 'NaN',
	appoinment_time time not NULL default 'NaN',
	status varchar(20) not null default 'pending',
	attended varchar(7) NOT NULL DEFAULT 'pending'
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp 
)

SELECT sc.*, cs.duration, se.unavailable_time
FROM schedule_consultant sc
LEFT JOIN consultant_specialty cs ON sc.id_consultant_specialty = cs.id
LEFT JOIN schedule_exception se ON se.id = sc.id
WHERE sc.date = '2025-02-18';

