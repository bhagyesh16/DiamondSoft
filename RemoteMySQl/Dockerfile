# Use Microsoft SQL Server official image
FROM mcr.microsoft.com/mssql/server:latest

# Set environment variables for MSSQL
ENV ACCEPT_EULA=Y
ENV SA_PASSWORD="iits123"
ENV MSSQL_PID=Express

EXPOSE 1433

CMD ["/opt/mssql/bin/sqlservr"]
