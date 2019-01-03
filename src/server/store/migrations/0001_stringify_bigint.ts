import migrator from '../utils/migrator';

export const { up, down } = migrator(__filename, {
  requires: '1.0.0',
  migration: async (knex) => {
    // Function which given a big int returns a string representation of it
    // For re-use by any id generator
    // Source: https://stackoverflow.com/a/12590064/2689319
    await knex.raw(`
      CREATE OR REPLACE FUNCTION stringify_bigint(input bigint) RETURNS text LANGUAGE plpgsql AS $$
        DECLARE
          alphabet text:='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          base int:=length(alphabet);
          abs_input bigint:=abs(input);
          output text:='';

        BEGIN
          WHILE abs_input > 0 LOOP
            output := output || substr(alphabet, 1+(abs_input%base)::int, 1);
            abs_input := abs_input / base;
          END LOOP;

        RETURN output;
      END $$
      ;
    `);
  },
});
