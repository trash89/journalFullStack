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
    font-size: 14px;
    &:nth-of-type(odd) {
      background-color: #d2e9fb;
    }

    &:nth-of-type(even) {
      background-color: #eaf5fd;
    }
  `,
  HeaderCell: `
        & > div {
          width: 100%;

          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `,
};

const PAGINATION_STATE = {
  state: {
    page: 0,
    size: 10,
  },
};
export { USER, dateFormat, TABLE_THEME, PAGINATION_STATE };
