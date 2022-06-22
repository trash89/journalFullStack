import styled from "styled-components";

const Wrapper = styled.section`
  .principal {
    display: grid;
    grid-template-columns: 1fr;
  }
  .principal-page {
    width: 95vw;
    margin: 0 auto;
    padding: 0.1rem 0;
  }
  @media (min-width: 992px) {
    .principal {
      grid-template-columns: auto 1fr;
    }
    .principal-page {
      width: 95%;
    }
  }
`;
export default Wrapper;
