import { Container } from 'reactstrap';

const BasePage = ({ className, children }) => (
  <div className={`base-page ${className}`}>
    <Container>
      {children}
    </Container>
  </div>
);

export default BasePage;
