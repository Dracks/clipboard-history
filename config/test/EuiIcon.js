const { createElement } = jest.requireActual('react')
const PT = jest.requireActual('prop-types')

const getComponentMock = (name)=>{
    return (props) => {
        const { children, onClick, onChange,  ...otherProps } = props
        return createElement('div', {title: name, onClick, onChange},
            JSON.stringify(otherProps),
            children ? createElement("label", {children}): null
        )
    }
}
const icon = getComponentMock("icon")

const COLORS = []
module.exports = {EuiIcon: icon, ICON_TYPES:["refresh"], ICON_COLORS: COLORS, COLORS, ICON_SIZES: [], IconPropType: PT.oneOfType([PT.string, PT.node])}