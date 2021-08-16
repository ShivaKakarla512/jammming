import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  renderAction (isRemoval) {
    return isRemoval ? '-' : '+';
  }

  addTrack () {
    this.props.onAdd(this.props.track);
  }

  removeTrack () {
    this.props.onRemove(this.props.track);
  }

  render () {
    return (
        <div className="Track">
            <div className="Track-information">
                <h3>{this.props.track.name}</h3>
                <p>{this.props.track.artist} | {this.props.track.album}</p>
            </div>
            <button onClick={this.props.isRemoval ? this.removeTrack : this.addTrack} className="Track-action">{this.renderAction(this.props.isRemoval)}</button>
        </div>
    );
  }
}

export default Track;
