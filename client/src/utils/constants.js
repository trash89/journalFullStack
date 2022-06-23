const USER = "USER";
const dateFormat = "DD/MM/YYYY";

const TABLE_THEME = {
  Table: `
      height: 100%;
    `,
  HeaderRow: `
    background-color: #eaf5fd;
  `,
  Row: `
    &:nth-of-type(odd) {
      background-color: #d2e9fb;
    }

    &:nth-of-type(even) {
      background-color: #eaf5fd;
    }
  `,
};

export { USER, dateFormat, TABLE_THEME };
