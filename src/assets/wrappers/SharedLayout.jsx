import styled from "styled-components";

const Wrapper = styled.section`
  .principal {
    display: grid;
    grid-template-columns: 1fr;
  }
  .principal-page {
    width: 100vw;
    margin: 0 auto;
    padding: 0;
  }
  @media (min-width: 992px) {
    .principal {
      grid-template-columns: auto 1fr;
    }
    .principal-page {
      width: 99%;
    }
  }
`;
export default Wrapper;
