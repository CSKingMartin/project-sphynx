import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'react-frame-component'
import StatefulContext from 'react-stateful-context'

import DragResizer from './DragResizer'
import css from './styles.module.css'

export const SpecimenHead = () => <React.Fragment />

class Preview extends React.Component {
  constructor (props) {
    super(props)
    this.$iframe = React.createRef()

    this.handleFrameHeight = this.handleFrameHeight.bind(this)
  }

  componentDidMount () {
    this.handleFrameHeight()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.maxWidth !== this.props.maxWidth) {
      this.handleFrameHeight()
    }
  }

  handleFrameHeight () {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      if (this.$iframe.current) {
        const iframe = this.$iframe.current.node
        const { body } = iframe.contentWindow.document
        const height = body.scrollHeight + 32

        iframe.height = ''
        iframe.height = height

        this.props.handleResize({ height })
      }
    })
  }

  renderChildren (children, context) {
    // this is causing infinite rendering on each frame
    return typeof children === 'function' ? children(context) : children
  }

  render () {
    const {
      Head = SpecimenHead,
      maxWidth,
      screenWidth,
      handleResize,
      hideResizer,
      children
    } = this.props

    return (
      <div className={css.preview}>
        <div
          className={css.previewFrameWrapper}
          style={{ maxWidth: maxWidth === Infinity ? undefined : `${maxWidth}px` }}
        >
          <StatefulContext.Consumer>
            {
              context =>
                <Frame
                  ref={this.$iframe}
                  sandbox="allow-scripts allow-same-origin allow-top-navigation"
                  head={<Head />}
                  className={css.previewFrame}
                  contentDidMount={this.handleFrameHeight}
                  contentDidUpdate={this.handleFrameHeight}
                >
                  {this.renderChildren(children, context)}
                </Frame>
            }
          </StatefulContext.Consumer>
        </div>

        {
          !hideResizer &&
          <DragResizer
            maxWidth={maxWidth}
            screenWidth={screenWidth}
            handleResize={handleResize}
          />
        }
      </div>
    )
  }
}

Preview.propTypes = {
  Head: PropTypes.any,
  maxWidth: PropTypes.number,
  screenWidth: PropTypes.number,
  handleResize: PropTypes.func,
  hideResizer: PropTypes.bool,
  children: PropTypes.any
}

Preview.defaultValue = {
  Head: SpecimenHead
}

export default Preview
