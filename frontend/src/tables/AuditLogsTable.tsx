import React, { useState, useEffect } from "react";
import { IAudit } from "../interfaces/IAudit";
import LogsService from "../services/logsService";

const AuditLogTable = () => {
  const [auditLogs, setAuditLogs] = useState<IAudit[]>([]);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await LogsService.getAllLogs();
        setAuditLogs(response.data);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      }
    };

    fetchAuditLogs();
  }, []);

  function formatRequestForLogs(jsonRequest: string) {
    const request = JSON.parse(jsonRequest);
    const { url, method, userId, timestamp } = request;
    const formattedTimestamp = new Date(timestamp).toLocaleString();

    return `URL: ${url}\nMethod: ${method}\nUser ID: ${userId}\nTimestamp: ${formattedTimestamp}`;
  }

  return (
    <div>
      <h2>Audit Logs</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Request Data</th>
            <th>Response Data</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.type}</td>
              <td>{formatRequestForLogs(JSON.stringify(log.requestData))}</td>
              <td>
                {log.responseData ? JSON.stringify(log.responseData) : "-"}
              </td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
