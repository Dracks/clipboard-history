import { EuiModal, EuiModalBody, EuiModalHeader, EuiModalHeaderTitle, EuiOverlayMask } from '@elastic/eui';
import React, { useCallback, useState } from 'react';


interface UseModalContentProps{
    close: ()=>void
}

interface ModalProps {
    closeFn:()=>void
    title?: string
    children: any
}

const Modal = ({closeFn, title, children}: ModalProps)=>(
    <EuiOverlayMask>
          <EuiModal onClose={closeFn}>
            <EuiModalHeader>
                {title &&<EuiModalHeaderTitle>{title}</EuiModalHeaderTitle>}
            </EuiModalHeader>

            <EuiModalBody>{children}</EuiModalBody>
          </EuiModal>
    </EuiOverlayMask>
)

export const useModal = (Body: React.ComponentType<UseModalContentProps>,  title?:string)=>{
    const [ isShowing, setShow ] = useState(false)
    const closeWindow = useCallback(()=>{
        setShow(false)
    }, [setShow])

    const modalContents = isShowing ? <Modal closeFn={closeWindow}>
        <Body close={closeWindow}/>
    </Modal> : null

    return {
        modal: modalContents,
        show: ()=>setShow(true)
    }
}

