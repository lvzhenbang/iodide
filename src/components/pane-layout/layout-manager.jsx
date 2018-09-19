import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'


import GoldenLayout from 'golden-layout'

import intialLayoutConfig from './layout-config-explore'
import {
  LAYOUT_MANAGER_IN_FRONT_ZINDEX,
  LAYOUT_MANAGER_IN_BACK_ZINDEX,
} from '../../style/z-index-styles'

class Positioner extends React.Component {
  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
        id={this.props.positionerId}
        className="layout-positioner"
      />
    )
  }
}

const positionerDefaults = {
  display: 'none', top: 0, left: 0, width: 0, height: 0,
}

function updateLayoutPositions(layout) {
  const panePositions = {
    EditorPositioner: Object.assign({}, positionerDefaults),
    ReportPositioner: Object.assign({}, positionerDefaults),
    ConsolePositioner: Object.assign({}, positionerDefaults),
    WorkspacePositioner: Object.assign({}, positionerDefaults),
    AppInfoPositioner: Object.assign({}, positionerDefaults),
  }

  layout._getAllContentItems() // eslint-disable-line no-underscore-dangle
    .filter(c => c.isComponent && !c.container.isHidden)
    .forEach((c) => {
      const rect = c.element[0].getBoundingClientRect()
      panePositions[c.config.props.positionerId] = {
        display: 'block',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }
    })

  return {
    type: 'UPDATE_PANE_POSITIONS',
    panePositions,
  }
}

export class LayoutManagerUnconnected extends React.PureComponent {
  static propTypes = {
    zIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }

  constructor(props) {
    super(props)
    this.layoutDiv = React.createRef()
    this.state = {
      goldenLayout: null,
      goldenLayoutResizer: null,
    }
  }

  componentDidMount() {
    // if (div && !this.state.goldenLayout) {
    const layout = new GoldenLayout(intialLayoutConfig, this.layoutDiv.current)
    layout.registerComponent('Positioner', Positioner)
    layout.init()
    layout.on('initialised', () => {
      if (this.state.goldenLayout === layout) return

      const goldenLayoutResizer = () => {
        layout.updateSize()
      }

      window.addEventListener('resize', goldenLayoutResizer)
      this.setState({
        goldenLayout: layout,
        goldenLayoutResizer,
      })
    })
    layout.on('stateChanged', () => {
      this.props.updateLayoutPositions(layout)
    })
    // }
  }

  componentDidUpdate() {
    this.state.goldenLayout.updateSize()
  }

  componentWillUnmount() {
    if (this.state.goldenLayout != null) {
      this.state.goldenLayout.destroy()
      window.removeEventListener('resize', this.state.goldenLayoutResizer)
    }
  }

  render() {
    return (
      <div
        ref={this.layoutDiv}
        className="layout-manager"
        style={{
          flexGrow: 1,
          minHeight: '100%',
          zIndex: this.props.zIndex,
        }}
      />
    )
  }
}

export function mapStateToProps(state) {
  return {
    zIndex: state.viewMode === 'REPORT_VIEW' ?
      LAYOUT_MANAGER_IN_BACK_ZINDEX
      : LAYOUT_MANAGER_IN_FRONT_ZINDEX,
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    updateLayoutPositions: layout => dispatch(updateLayoutPositions(layout)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutManagerUnconnected)
