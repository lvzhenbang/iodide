import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "react-emotion";

import ArrowBack from "@material-ui/icons/ArrowBack";
import { ValueRenderer } from "../../../components/reps/value-renderer";
import PreformattedTextItemsHandler from "../../../components/reps/preformatted-text-items-handler";

import PaneContentButton from "./pane-content-button";
import { postMessageToEditor } from "../../port-to-editor";
import { EVALUATION_RESULTS } from "../../actions/actions";

const ConsoleMessage = styled("div")`
  padding: 5px;
  padding-left: 10px;
  border-bottom: 0.5px solid gainsboro;
  display: flex;
  align-items: baseline;
  background-color: ${props => props.levelColor};

  div {
    padding-left: 5px;
    padding-right: 5px;
  }

  li div {
    background-color: ${props => props.levelColor};
  }
`;

export class HistoryItemUnconnected extends React.Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    cellId: PropTypes.number,
    historyId: PropTypes.number.isRequired,
    historyType: PropTypes.string.isRequired,
    lastRan: PropTypes.number.isRequired,
    levelColor: PropTypes.string
  };
  constructor(props) {
    super(props);
    // this.state = { timeSince: 'just now' }
    this.showEditorCell = this.showEditorCell.bind(this);
  }

  showEditorCell() {
    postMessageToEditor("CLICK_ON_OUTPUT", {
      id: this.props.cellId,
      autoScrollToCell: true
    });
  }

  render() {
    let output;
    let showCellReturnButton = true;
    switch (this.props.historyType) {
      case "CELL_EVAL_VALUE":
        output = (
          <ValueRenderer render valueToRender={this.props.valueToRender} />
        );
        break;
      case "CELL_EVAL_INFO":
        output = this.props.valueToRender;
        break;
      case "CONSOLE_MESSAGE":
        return (
          <ConsoleMessage levelColor={this.props.levelColor}>
            {/* {this.props.valueToRender} <ValueRenderer render valueToRender={this.props.valueToRender} /> */}
            {this.props.valueToRender.map(v => (
              <ValueRenderer
                key={`out-${Math.random()}-${v.toString()}`}
                render
                valueToRender={v}
              />
            ))}
          </ConsoleMessage>
        );
      case "CONSOLE_EVAL":
        output = (
          <ValueRenderer render valueToRender={this.props.valueToRender} />
        );
        showCellReturnButton = false;
        break;
      case "FETCH_CELL_INFO":
        output = (
          <PreformattedTextItemsHandler textItems={this.props.valueToRender} />
        );
        break;
      default:
        // TODO: Use better class for inline error
        output = <div>Unknown history type {this.props.historyType}</div>;
        break;
    }

    const cellReturnButton = showCellReturnButton ? (
      <div className="history-metadata-positioner">
        <div className="history-metadata">
          <div className="history-show-actual-cell">
            <PaneContentButton
              text="scroll to cell"
              onClick={this.showEditorCell}
            >
              <ArrowBack style={{ fontSize: "12px" }} />
            </PaneContentButton>
          </div>
          {/* <div className="history-time-since"> {this.state.timeSince} </div> */}
        </div>
      </div>
    ) : (
      ""
    );

    return (
      <div
        id={`history-item-id-${this.props.historyId}`}
        className="history-cell"
      >
        <div className="history-content editor">
          {cellReturnButton}
          <pre className="history-item-code">{this.props.content}</pre>
        </div>
        <div className="history-item-output">{output}</div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  let levelColor;
  if (ownProps.historyItem) {
    const level = ownProps.historyItem.content;
    if (level !== undefined) {
      if (level === "log") {
        levelColor = "white";
      } else if (level === "warn") {
        levelColor = "rgb(255,251,214)";
      } else if (level === "error") {
        levelColor = "rgb(253, 242, 245)";
      }
    }
  }
  return {
    content: ownProps.historyItem.content,
    cellId: ownProps.historyItem.cellId,
    historyId: ownProps.historyItem.historyId,
    historyType: ownProps.historyItem.historyType,
    lastRan: ownProps.historyItem.lastRan,
    valueToRender: EVALUATION_RESULTS[ownProps.historyItem.historyId],
    levelColor
  };
}

export default connect(mapStateToProps)(HistoryItemUnconnected);
