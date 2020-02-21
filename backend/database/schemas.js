let schemas = {
    promotion_schema: `CREATE TABLE promotion (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        type text not null unique, 
        description text not null, 
        calculate text
    )`,
    product_schema: `CREATE TABLE product (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name text not null,  
        code text not null unique,
        description text, 
        value INTEGER not null check (value >= 0),
        id_promotion INTEGER UNSIGNED,
        foreign key (id_promotion) references promotion(id) 
    )`, 

}

module.exports = schemas;