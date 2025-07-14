/* eslint-disable @typescript-eslint/no-explicit-any */
export const orderTransportHtml = (
    findOrderTransport: any,
    car: any,
    carModel: any,
    dealer: any,
    payload: any,
) => {
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Car Transport Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
        }

        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            width: 600px;
            margin: 0 auto;
        }

        h1 {
            color: #2c3e50;
        }

        p {
            font-size: 16px;
        }

        .details {
            margin-top: 20px;
            padding: 10px;
            background-color: #ecf0f1;
            border-radius: 5px;
        }

        .details p {
            margin: 5px 0;
        }

        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #7f8c8d;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Car Transport Request</h1>
        <p>Dear ${findOrderTransport?.companyName},</p>
        <p>I hope this message finds you well. We are requesting your services for transporting a car from the seller to
            the buyer. Please find the details below:</p>

        <div class="details">
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <h1
                    style="text-align: left; background-color: #f2f2f2; padding: 10px; font-size: 16px; font-weight: 900;">
                    Car Details:
                </h1>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;font-weight: 700;">
                        Mærke & model
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${carModel?.brand || carModel?.mark} ${carModel?.model}
                    </td>
                </tr>

                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;font-weight: 700;">
                        Biltype
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${car?.carCategory || 'N/A'}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;font-weight: 700;">
                        Kilometer
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${car?.noOfKmDriven || carModel?.DrivenKm + "KM" || 'N/A'}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: 700;">
                        Brændstof
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${carModel?.fuelType || carModel?.fuel || 'N/A'}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd ; font-weight: 700;">
                        Chassisnummer
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${car?.chassisNumber || carModel?.chassisNumber || 'N/A'}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: 700;">
                        Registreringsnummer
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${car?.registrationNumber || carModel?.carLicensePlateNumber ||
        'N/A'}
                    </td>
                </tr>

            </table>


            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">

                <h1
                    style="text-align: left; background-color: #f2f2f2; padding: 10px 10px 0 0 ; font-size: 16px; font-weight: 900;">
                    From Address
                </h1>

                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: 700;">
                        Fornavn
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${payload?.carModel
            ? car?.companyId?.first_name : dealer?.profile?.first_name
        }
                    </td>
                </tr>



                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd ; font-weight: 700;">
                        Efternavn
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${payload?.carModel
            ? car?.companyId?.last_name : dealer?.profile?.last_name
        }
                    </td>



                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: 700;"> Address: </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${payload?.carModel
            ? car?.companyId?.street : dealer?.profile?.street
        }

                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                        Postnr.</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${payload?.carModel
            ? car?.companyId?.postCode : dealer?.profile?.zip
        }
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                        By: </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${payload?.carModel
            ? car?.companyId?.city : dealer?.profile?.city
        }
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                        Telefon: </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${payload?.carModel
            ? car?.companyId?.phoneNumber : dealer?.profile?.phoneNumber
        }
                    </td>
                </tr>

                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                        Privatperson / Virksomhed CVR:
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${!payload?.offerCarId ? car?.companyId?.cvrNumber ?
            car?.companyId?.cvrNumber : 'Privatperson'
            : dealer?.profile?.cvrNumber ? dealer?.profile?.cvrNumber :
                'Privatperson'
        }
                    </td>
                </tr>

                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                        Email: </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${payload?.carModel
            ? car?.carOwner?.email : dealer?.email
        }
                    </td>
                </tr>

            </table>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">

                <h1
                    style="text-align: left; background-color: #f2f2f2; padding: 10px 10px 0 0 ; font-size: 16px; font-weight: 900;">

                    To Address

                </h1>

                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: 700;">
                        Fornavn
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${payload?.carModel ? dealer?.profile?.first_name : car?.userId?.profile?.first_name}
                    </td>
                </tr>



                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd ; font-weight: 700;">
                        Efternavn
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                       
                          ${payload?.carModel ? dealer?.profile?.last_name : car?.userId?.profile?.last_name}
                    </td>



                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: 700;">
                        Address:
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                       
                        ${payload?.carModel ? dealer?.profile?.street : car?.userId?.profile?.street}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                        Postnr.
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                      
                         ${payload?.carModel ? dealer?.profile?.zip : car?.userId?.profile?.zip}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                        By:
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        
                             ${payload?.carModel ? dealer?.profile?.city : car?.userId?.profile?.city}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                        Telefon:
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        
                         ${payload?.carModel ? dealer?.profile?.phoneNumber : car?.userId?.profile?.phoneNumber}
                    </td>
                </tr>

                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                        Privatperson
                        /
                        Virksomhed
                        CVR:
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${payload?.carModel ? dealer?.profile?.cvrNumber ? dealer?.profile?.cvrNumber : 'Privatperson' : car?.userId?.profile?.cvrNumber ? car?.userId?.profile?.cvrNumber : 'Privatperson'}
                    </td>
                </tr>

                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">
                        Email:
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        
                        ${payload?.carModel ? dealer?.email : car?.userId?.email}
                    </td>
                </tr>

            </table>


            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">

                <h1
                    style="text-align: left; background-color: #f2f2f2; padding: 10px 10px 0 0 ; font-size: 16px; font-weight: 900;">
                    Comments:
                </h1>

                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: 700;">
                        ${payload?.comments
            ?
            payload?.comments
            :
            'No comments'}
                    </td>

                </tr>


            </table>


            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">

                <h1
                    style="text-align: left; background-color: #f2f2f2; padding: 10px 10px 0 0 ; font-size: 16px; font-weight: 900;">
                    Transportør Company Details:
                </h1>

                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: 700;">
                        companyName
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${findOrderTransport?.companyName}
                    </td>
                </tr>



                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd ; font-weight: 700;">
                        Address
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${findOrderTransport?.address}
                    </td>
                </tr>

                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd ; font-weight: 700;">
                        Postnr.
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${findOrderTransport?.zip}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd ; font-weight: 700;">
                        By
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${findOrderTransport?.address}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd ; font-weight: 700;">
                        Telefon
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${findOrderTransport?.phone}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd ; font-weight: 700;">
                        Email
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${findOrderTransport?.email}
                    </td>
                </tr>

                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd ; font-weight: 700;">
                        Contact
                        Person
                    </td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        ${findOrderTransport?.contactPerson}
                    </td>
                </tr>


            </table>


        </div>
        <p> Please confirm if the transport service is available, and let us know the estimated cost and delivery time.
            If you need any more details, feel free to reach out.</p>
        <p> We look forward to working with you on this transport request.</p>

        <div class="footer">
            <p>Best regards, <br>
                Car Treading < br>
            </p>
        </div>
    </div>
</body>

</html>
    
    
    `

}
