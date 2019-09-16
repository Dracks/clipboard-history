import { EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiModalHeaderTitle, EuiOverlayMask } from '@elastic/eui';
import React, { useCallback, useState } from 'react';


interface UseModalContentProps{
    close: ()=>void
}

interface ModalProps {
    closeFn:()=>void
    title?: string
    footer?: any
    children: any
}

const Modal = ({closeFn, title, footer, children}: ModalProps)=>{
    return <EuiOverlayMask>
          <EuiModal onClose={closeFn}>
            <EuiModalHeader>
                {title &&<EuiModalHeaderTitle>{title}</EuiModalHeaderTitle>}
            </EuiModalHeader>

            <EuiModalBody>{children}</EuiModalBody>
            {footer && <EuiModalFooter>{footer}</EuiModalFooter>}
          </EuiModal>
    </EuiOverlayMask>
}

type InternalComponent = React.ComponentType<UseModalContentProps>

export const useModal = (Body: InternalComponent,  extras:{title?:string, Footer?:InternalComponent})=>{
    const [ isShowing, setShow ] = useState(false)
    const closeWindow = useCallback(()=>{
        setShow(false)
    }, [setShow])
    const { Footer } = extras

    const modalContents = isShowing ? <Modal
        closeFn={closeWindow}
        title={extras.title}
        footer={Footer && <Footer close={closeWindow} />}
        >
        <Body close={closeWindow}/>
    </Modal> : null

    return {
        modal: modalContents,
        show: ()=>setShow(true)
    }
}

