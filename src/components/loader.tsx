import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="typing-indicator">
        <div className="typing-circle" />
        <div className="typing-circle" />
        <div className="typing-circle" />
        <div className="typing-shadow" />
        <div className="typing-shadow" />
        <div className="typing-shadow" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  z-index: 9999;

  .typing-indicator {
    width: 60px;
    height: 30px;
    position: relative;
    z-index: 4;
  }

  .typing-circle {
    width: 8px;
    height: 8px;
    position: absolute;
    border-radius: 50%;
    background-color: #fff;
    left: 15%;
    transform-origin: 50%;
    animation: typing-circle 0.5s alternate infinite ease;
  }

  @keyframes typing-circle {
    0% {
      top: 20px;
      height: 5px;
      border-radius: 50px 50px 25px 25px;
      transform: scaleX(1.7);
    }
    40% {
      height: 8px;
      border-radius: 50%;
      transform: scaleX(1);
    }
    100% {
      top: 0%;
    }
  }

  .typing-circle:nth-child(2) {
    left: 45%;
    animation-delay: 0.2s;
  }

  .typing-circle:nth-child(3) {
    left: auto;
    right: 15%;
    animation-delay: 0.3s;
  }

  .typing-shadow {
    width: 5px;
    height: 4px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    position: absolute;
    top: 30px;
    transform-origin: 50%;
    z-index: 3;
    left: 15%;
    filter: blur(1px);
    animation: typing-shadow 0.5s alternate infinite ease;
  }

  @keyframes typing-shadow {
    0% {
      transform: scaleX(1.5);
    }
    40% {
      transform: scaleX(1);
      opacity: 0.7;
    }
    100% {
      transform: scaleX(0.2);
      opacity: 0.4;
    }
  }

  .typing-shadow:nth-child(4) {
    left: 45%;
    animation-delay: 0.2s;
  }

  .typing-shadow:nth-child(5) {
    left: auto;
    right: 15%;
    animation-delay: 0.3s;
  }
`;

export default Loader;
