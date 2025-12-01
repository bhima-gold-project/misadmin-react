   import * as XLSX from "xlsx";
   import { saveAs } from "file-saver";
   
   export const ExportExcel = (data) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Report");

        const excelBuffer = XLSX.write(wb, {
            bookType: "xlsx",
            type: "array"
        });

        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream"
        });

        saveAs(blob, `report_${Date.now()}.xlsx`);
    };


    /////////////////////////////////BACKEND CODE FOR EXCEL EXPORT ////////////

      //    const ExportExcel = async () => {
        //         try {
        //             const response = await axios.post(
        //                 `${BASE_URL}/api/exportToExcel`,
        //                 shipmentStatusData?.flat(),
        //                 {
        //                     responseType: "blob"
        //                 }
        //             );
    
        //             // Create download link
        //             const url = window.URL.createObjectURL(new Blob([response.data]));
        //             const link = document.createElement("a");
        //             link.href = url;
        //             link.setAttribute("download", `report_${Date.now()}.xlsx`);
        //             document.body.appendChild(link);
        //             link.click();
        //             link.remove();
    
        //         } catch (err) {
        //             console.error(err);
        //         }
        //     };