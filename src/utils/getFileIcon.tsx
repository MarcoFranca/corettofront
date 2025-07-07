import {
    FilePdfOutlined,
    FileImageOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FileTextOutlined,
    FileUnknownOutlined,
} from "@ant-design/icons";

/**
 * Retorna o ícone correto pelo nome/extensão do arquivo.
 */
export function getFileIcon(filename: string) {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case "pdf": return <FilePdfOutlined style={{ color: "#E2574C", fontSize: 22 }} />;
case "png":
case "jpg":
case "jpeg":
case "gif": return <FileImageOutlined style={{ color: "#33cccc", fontSize: 22 }} />;
case "doc":
case "docx": return <FileWordOutlined style={{ color: "#2858A7", fontSize: 22 }} />;
case "xls":
case "xlsx": return <FileExcelOutlined style={{ color: "#22A34B", fontSize: 22 }} />;
case "txt": return <FileTextOutlined style={{ color: "#888", fontSize: 22 }} />;
default: return <FileUnknownOutlined style={{ color: "#bbb", fontSize: 22 }} />;
}
}

/**
 * Retorna a cor para cada categoria de documento.
 */
export function getCategoryTagColor(categoria: string) {
    switch (categoria) {
        case "identidade": return "blue";
        case "comprovante_residencia": return "cyan";
        case "declaracao_saude": return "magenta";
        case "contrato": return "volcano";
        case "proposta": return "purple";
        case "apolice": return "green";
        case "outros": return "default";
        default: return "geekblue";
    }
}
