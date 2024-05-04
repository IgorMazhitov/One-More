import { Table, TableCell, TableHead } from "../../UI/styled/tables";
import {
  formatRequestForLogs,
  formatResponseForLogs,
} from "../../common/helpers";
import { IAudit } from "../../interfaces/IAudit";

interface LogsTableComponentProps {
  logs: IAudit[];
}

const LogsTableComponent: React.FC<LogsTableComponentProps> = ({ logs }) => {
  const formattedLogs = logs.map((log) => {
    return {
      ...log,
      requestData: formatRequestForLogs(JSON.stringify(log.requestData)),
      responseData: formatResponseForLogs(JSON.stringify(log.responseData)),
    };
  });
  return (
    <Table>
      <thead>
        <tr>
          <TableHead>Email</TableHead>
          <TableHead>Id</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Request</TableHead>
          <TableHead>Response</TableHead>
        </tr>
      </thead>
      <tbody>
        {formattedLogs.map((log) => (
          <tr key={log.id}>
            <TableCell>{log.email}</TableCell>
            <TableCell>{log.id}</TableCell>
            <TableCell>{log.type}</TableCell>
            <TableCell>{log.createdAt.toLocaleString()}</TableCell>
            <TableCell>{log.requestData}</TableCell>
            <TableCell>{log.responseData}</TableCell>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LogsTableComponent;