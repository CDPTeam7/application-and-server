import { useWebcam } from "@/hooks/useWebcam";
import { styled } from "@linaria/react";
import { Button } from "@mui/material";
import Webcam from "react-webcam";

const Modal = styled.div<{ isShow: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  display: ${(props) => (props.isShow ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
  z-index: 9999;
  background: #00000096;

  & .window {
    width: 90vw;
    height: 90vh;
    border-radius: 16px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  & .cam {
    width: 100%;
    height: 480px;
    border-radius: 16px;
  }

  & .button {
    margin-top: 16px;
    color: white;
  }
`;

interface CameraModalProps {
  isShow: boolean;
  setShow: React.Dispatch<boolean>;
  clickEventHandler: Function;
}

export default function CameraModal(props: CameraModalProps) {
  const { isShow, setShow, clickEventHandler } = props;
  const { webcamRef, setImage } = useWebcam();
  const buttonClickHandler = () => {
    setShow(false);
    clickEventHandler();
    setImage();
  };
  return (
    <Modal isShow={isShow}>
      <div className="window">
        <Webcam width={800} className="cam" ref={webcamRef} disabled={isShow} />
        <Button className="button" variant="contained" onClick={buttonClickHandler}>
          사진 촬영
        </Button>
        <Button className="button" variant="outlined" onClick={() => setShow(false)}>
          취소
        </Button>
      </div>
    </Modal>
  );
}
