import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { format } from 'date-fns'


const instance = axios.create({
    baseURL: 'http://localhost:5000',
});

async function clientesPDF(clientes){
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const data= format(new Date(), 'dd/MM/yyyy HH:MM')
    const datafiltro=format(new Date(), 'dd/MM/yyyy ')
 
    const cabecalho =  [
        {
            table:{
            
                headerRows: 1,
                widths: ['*','*','*'],
                body: [
                    
                    [
                        {text: 'APS-Tascom ',  style: 'noBorders', fontSize: 10,alignment:'left' ,margin:[10,0,0,0]},
                                                                                //alignment:'center','left'
                        {text: 'TASCOM TECNOLOGIA ',  style: 'noBorders', fontSize: 10,alignment:'center' ,margin:[0,0,0,0]},
                        {text:   'Em:' + data,  style: 'noBorders', fontSize: 10,alignment:'right' ,margin:[0,0,10,0]},
                    
                    ],

                ]
            },
            layout:'noBorders'
        }
    ];

                    

   
                                                
    
    let patientData  = await instance.get("/api/attendances")
    console.log(patientData);
     
    
   // const marc_D_agua =  'Tascom Tecnologia';
      
    const tpRelatorio = [
        {
            table:{
            
                headerRows: 1,
                widths: ['*'],
                body: [
                    
                    [
                        {text: 'Relatorio Atendimento Por Período ',  style: 'noBorders', fontSize: 10,alignment:'center' ,margin:[0,0,0,0]},
                    
                    ],

                ]
            },
            layout:'noBorders'
        }
    ];

    const filtro = [
        {
            table:{
               
                headerRows: 1,
                widths: ['*'],
                body: [
                    
                    [
                        
                        {text: ' Periodo de  '+ datafiltro +' até '+ datafiltro+ ' | Convênio : * | Serviço= * ', fontSize: 10,alignment:'center' ,margin:[0,5,0,5] },
                      
                    ],
                ]
            },
            layout:'noBorders'
        }
    ];


    const dados = clientes.map((cliente) => {
        
            return [
                
                {text: cliente.cod_atend, fontSize: 9,alignment: 'center', margin: [0, 1, 0, 1]},
                {text: cliente.data_atend, fontSize: 9,alignment: 'center', margin: [0, 1, 0, 1]},
                {text: cliente.prestador, fontSize: 9, margin: [0, 1, 0, 1]},
                {text: cliente.paciente, fontSize: 9, margin: [0, 1, 0, 1]},
                {text: cliente.plano, fontSize: 9,alignment: 'center', margin: [0, 1, 0, 1]},
                
               
            ]
        }
       
    );
    

    const details = [
        {
            table:{
                style:'tableExample',
                headerRows: 1,
                widths: [65, 70, 170, 135, 65 ],
                
                body: [
                   
                    [
                        {text: 'Atendimento', style: 'tableHeader', fontSize: 11 , border:[false,false,false,true]},
                        {text: 'Data', style: 'tableHeader', alignment: 'center',fontSize: 11,border:[false,false,false,true] },
                        {text: 'Prestador', style: 'tableHeader', fontSize: 11,border:[false,false,false,true]},
                        {text: 'Paciente ', style: 'tableHeader', fontSize: 11,border:[false,false,false,true]},
                        {text: 'Plano  ', style: 'tableHeader', fontSize: 11,alignment: 'center',border:[false,false,false,true]},
                       
                        
                    ],
                    
                    ...dados,
                     
                ]
            },
            layout: {
				hLineWidth: function (i, node) {//horizontal
					return (i === 1 || i === node.table.body.length) ? 2 : 1;
				},
				vLineWidth: function (i, node) {//vertical
					return (i === 0 || i === node.table.widths.length) ? 2 : 2;
				},
				hLineColor: function (i, node) {
					return (i ===  1 || i === node.table.body.length) ? 'black' : 'gray' ;
				},
               
				vLineColor: function (i, node) {
					return (i === 0 || i === node.table.widths.length) ? 'white' : 'white';
				},
            },   
        }
    ];
    var total =  [{  text: 'Total de Atendimentos:'+ dados.length , fontSize: 10,bold:true,  margin:[10,10,0,15] }]
    

    function Rodape(currentPage, pageCount){
      return  {text: ' Emitido por:' + "Tom" +' \n'+'Paginas' + currentPage.toString() + '/' + pageCount , alignment: 'right', fontSize: 10, bold:true,margin: [0, 0, 10, 0] }
                                                                                        //Margin [ left, top, right, bottom ]

    }
    const docDefinitios = {
        pageSize: 'A4',
        pageMargins: [15, 55, 15, 40],
        

       
        content: [ tpRelatorio , filtro ,details,total],
        header:function(currentPage, pageCount, pageSize) {
            // you can apply any logic and return any valid pdfmake element
            return [  cabecalho, { canvas: [ { type: 'rect', x: 190, y: 20, w: pageSize.width - 190, h: 40 } ] },
                     ]    
                     
        },
    
       // watermark: { text: marc_D_agua, color: 'gray ', x, bold: true, italics: false, fontSize: 50, angle: 0},
        footer: Rodape 
        
    }

    pdfMake.createPdf(docDefinitios).print();
}

export default clientesPDF;