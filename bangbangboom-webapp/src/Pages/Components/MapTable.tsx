import React from "react"
import { TableHead, TableRow, TableCell, TableRowProps } from "@material-ui/core"
import { FormattedMessage } from "react-intl"
import { MapInfo } from "../../Global/Modals"
import { CanNone } from "./CanNone"
import { DateTime } from "./DateTime"

export const MapTableHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell>Id</TableCell>
      <TableCell><FormattedMessage id="label.music" /></TableCell>
      <TableCell><FormattedMessage id="label.artist" /></TableCell>
      <TableCell><FormattedMessage id="label.mapname" /></TableCell>
      <TableCell><FormattedMessage id="label.difficulty" /></TableCell>
      <TableCell><FormattedMessage id="label.lastmodified" /></TableCell>
      <TableCell><FormattedMessage id="label.status" /></TableCell>
      <TableCell></TableCell>
    </TableRow>
  </TableHead>)

export type MapTableRowProps = { m: MapInfo, actions?: React.ReactNode } & TableRowProps
export const MapTableRow = ({ m, actions, ...others }: MapTableRowProps) => (
  <TableRow {...others}>
    <TableCell component="th" scope="row">{m.id}</TableCell>
    <TableCell><CanNone value={m.musicname} /></TableCell>
    <TableCell><CanNone value={m.artist} /></TableCell>
    <TableCell><CanNone value={m.mapname} /></TableCell>
    <TableCell>{m.difficulty || "-"}</TableCell>
    <TableCell><DateTime date={m.lastmodified} /></TableCell>
    <TableCell><FormattedMessage id={"mapstatus." + m.status} /></TableCell>
    <TableCell>{actions}</TableCell>
  </TableRow>)