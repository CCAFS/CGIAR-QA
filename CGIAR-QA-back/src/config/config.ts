export default {
    jwtSecret: "@QEGTUI",
    port: 8800,
    jwtTime: '5h',
    host: '0.0.0.0',
    active_directory: {
        url: 'ldap://ciatroot3.cgiarad.org:3268',
        baseDN: 'DC=CGIARAD, DC=ORG',
        domain: "CGIARAD.ORG"
    }
};