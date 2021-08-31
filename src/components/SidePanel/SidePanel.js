import React from "react";
import UserPanel from "./UserPanel";
import { Menu } from "semantic-ui-react";
class SidePanel extends React.Component {
  render() {
    const { currentUser,primaryColor } = this.props;

    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{ background: primaryColor, fontSize: "1.2rem" }}
      >
        <UserPanel primaryColor={primaryColor} currentUser={currentUser} />
      </Menu>
    );
  }
}

export default SidePanel;