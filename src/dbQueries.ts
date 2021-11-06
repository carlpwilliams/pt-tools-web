export const prepareStats = `
    CREATE INDEX IF NOT EXISTS "position_history_currency_pair" ON "position_history_entity" (
        "currency_pair"
    );

    DROP VIEW IF EXISTS "main"."sales";
    CREATE VIEW sales AS select phe.currency_pair,

    (phe.sold_date - PHE.first_bought_date) /1000/60/60/24 AS trade_duration_days,

    (phe.sold_date - PHE.first_bought_date) /1000/60/60 AS trade_duration_mins,

    (((total_cost /total_amount)* sold_amount)* profit) /100 as profit_currency,

    datetime(ROUND(phe.first_bought_date / 1000), 'unixepoch') AS firstbought,

    datetime(ROUND(phe.sold_date / 1000), 'unixepoch') AS sold_date_unix

    , first_bought_date
    , sold_date
    , history_type
    , profit
    , currency
    from position_history_entity phe where history_type = 'SELL_HISTORY' or history_type = 'SELL_HISTORY'
    order by 3 desc, currency desc;


    DROP VIEW IF EXISTS "main"."sales_stats";
    CREATE VIEW sales_stats AS select phe.currency_pair,
    (select max(bought_times) from position_history_entity pheB where pheB.currency_pair = phe.currency_pair and pheB.history_type = 'SELL_HISTORY' and phe.first_bought_date = pheB.first_bought_date) dcad,

    (select  count(*) from sales pheT where pheT.currency_pair = phe.currency_pair and pheT.history_type = 'SELL_HISTORY') as total_times_pair_sold,

    (select sum((((total_cost /total_amount)* sold_amount)* profit) /100) from position_history_entity phePC where phePC.currency_pair= phe.currency_pair and phePC.history_type='SELL_HISTORY') AS total_coin_profit_currency,

    (select sum(profit) from sales pheTP where pheTP.currency_pair = phe.currency_pair and pheTP.history_type = 'SELL_HISTORY') total_coin_profit_perc,

    (select sum(profit)/count(*) from sales pheTP where pheTP.currency_pair = phe.currency_pair and pheTP.history_type = 'SELL_HISTORY') average_sale_profit,

    (select (sum((pheA.sold_date - pheA.first_bought_date)) / count(*))/1000/60/60 from position_history_entity pheA where pheA.currency_pair = phe.currency_pair and pheA.history_type = 'SELL_HISTORY') as average_duration
    , *

    from sales phe where history_type = 'SELL_HISTORY'
    order by 3 desc, currency desc;
`;
