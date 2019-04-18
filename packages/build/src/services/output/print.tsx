import { render, Color, Box } from 'ink'

import * as React from 'react'

export interface IPrinterProps {
  text: string
}

export class Printer extends React.Component<IPrinterProps> {
  render() {
    return (
      <Box>
        {' '}
        <Color green>{this.props.text}</Color>
      </Box>
    )
  }
}
