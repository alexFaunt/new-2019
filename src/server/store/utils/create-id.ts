const isPrime = (num) => {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return num > 1;
};

const generateSecretSauce = () => {
  const im = Math.round(100000 + Math.random() * 899999); // Pick a random 6 digit number for im
  const ia = Math.round(1000 + Math.random() * 8999); // Pick a random 4 digit number for ia

  // Look for a decent prime value for ic within 20 of the value (1/2 - root(3)/6)*im
  const exact = ((0.5 - (Math.sqrt(3) / 6)) * im);
  const rounded = Math.round(exact);
  const maxRange = 20;
  let diff = 0;
  let ic = null;

  while (diff < maxRange && ic === null) {
    if (isPrime(rounded + diff)) {
      ic = rounded + diff;
    }
    if (isPrime(rounded - diff)) {
      ic = rounded - diff;
    }

    diff += 1;
  }

  if (!ic) {
    throw new Error('No IC found - stopping to avoid infinite loop');
  }

  return {
    ic,
    im,
    ia,
  };
};

export default async ({ knex, table, prefix }) => {
  const { ia, ic, im } = generateSecretSauce();

  // Function to create a string id from a seed
  // Used in conjunction with a serial id as a seed to ensure unique random ids for all rows
  // The prefix is hard coded in to ensure no one re-uses this function for other tables
  await knex.raw(`
    CREATE OR REPLACE FUNCTION create_${table}_id(input bigint) RETURNS text LANGUAGE plpgsql AS $$
      DECLARE
        l1 bigint;
        l2 bigint;
        r1 bigint;
        r2 bigint;
        i int:=0;

      BEGIN
        l1:= (input >> 32) & 4294967295::bigint;
        r1:= input & 4294967295;

        WHILE i < 3 LOOP
          l2 := r1;
          r2 := l1 # ((((${ia}.0 * r1 + ${ic}) % ${im}) / ${im}.0) * 32767*32767)::int;
          l1 := l2;
          r1 := r2;
          i := i + 1;
        END LOOP;

      RETURN concat('${prefix}_', stringify_bigint((l1::BIGINT << 32) + r1));
    END $$
    ;
  `);

  // Use the function to generate us random non colliding string ids using a sequence
  await knex.raw(`
    ALTER TABLE app.${table} ADD COLUMN id VARCHAR PRIMARY KEY;

    CREATE SEQUENCE app.${table}_id_seed INCREMENT BY 1 START WITH 1 OWNED BY app.${table}.id;

    ALTER TABLE app.${table} ALTER COLUMN id SET DEFAULT create_${table}_id(nextval('app.${table}_id_seed'));
  `);
};
