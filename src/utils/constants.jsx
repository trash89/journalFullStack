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
    font-size: 1rem;
    &:nth-of-type(odd) {
      background-color: #84beeb;
    }

    &:nth-of-type(even) {
      background-color: #eaf5fd;
    }
  `,
  HeaderCell: `
        & > div {
          width: 100%;
          display: flex;
          justify-content: left;
          align-items: center;
        }
      `,
};

const PAGINATION_STATE = {
  state: {
    page: 0,
    size: 8,
  },
};
export { USER, dateFormat, TABLE_THEME, PAGINATION_STATE };
