<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';


/*
|--------------------------------------------------------------------------
| Only allow POST requests
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Invalid request.";
    exit;
}


/*
|--------------------------------------------------------------------------
| Get form data
|--------------------------------------------------------------------------
*/

$fname   = trim($_POST['fname'] ?? '');
$lname   = trim($_POST['lname'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$email   = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');


/*
|--------------------------------------------------------------------------
| Validate form
|--------------------------------------------------------------------------
*/

if (
    empty($fname) ||
    empty($lname) ||
    empty($phone) ||
    empty($email) ||
    empty($message)
) {
    echo "Please fill in all required fields.";
    exit;
}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Please enter a valid email address.";
    exit;
}


/*
|--------------------------------------------------------------------------
| Create PHPMailer
|--------------------------------------------------------------------------
*/

$mail = new PHPMailer(true);


try {

    /*
    |--------------------------------------------------------------------------
    | SMTP Configuration
    |--------------------------------------------------------------------------
    */

    $mail->isSMTP();

    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;

    /*
    |--------------------------------------------------------------------------
    | YOUR GMAIL
    |--------------------------------------------------------------------------
    */

    $mail->Username   = 'tahsiontech@gmail.com';


    /*
    |--------------------------------------------------------------------------
    | YOUR GMAIL APP PASSWORD
    |--------------------------------------------------------------------------
    |
    | Do NOT put your normal Gmail password here.
    |
    */

    $mail->Password   = 'YOUR_GMAIL_APP_PASSWORD';


    /*
    |--------------------------------------------------------------------------
    | Encryption
    |--------------------------------------------------------------------------
    */

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;


    /*
    |--------------------------------------------------------------------------
    | Sender
    |--------------------------------------------------------------------------
    */

    $mail->setFrom(
        'tahsiontech@gmail.com',
        'Website Contact Form'
    );


    /*
    |--------------------------------------------------------------------------
    | Receiver
    |--------------------------------------------------------------------------
    */

    $mail->addAddress(
        'tahsiontech@gmail.com',
        'Tahsin'
    );


    /*
    |--------------------------------------------------------------------------
    | Reply To Client
    |--------------------------------------------------------------------------
    */

    $mail->addReplyTo(
        $email,
        $fname . ' ' . $lname
    );


    /*
    |--------------------------------------------------------------------------
    | Email Format
    |--------------------------------------------------------------------------
    */

    $mail->isHTML(true);


    /*
    |--------------------------------------------------------------------------
    | Email Subject
    |--------------------------------------------------------------------------
    */

    $mail->Subject = 'New Website Inquiry - ' . $fname . ' ' . $lname;


    /*
    |--------------------------------------------------------------------------
    | Email Body
    |--------------------------------------------------------------------------
    */

    $mail->Body = '

    <div style="
        font-family: Arial, Helvetica, sans-serif;
        max-width: 650px;
        margin: 0 auto;
        background: #ffffff;
        padding: 30px;
        border: 1px solid #eeeeee;
    ">

        <h2 style="
            margin-top: 0;
            margin-bottom: 25px;
            color: #222222;
        ">
            New Contact Form Submission
        </h2>


        <table style="
            width: 100%;
            border-collapse: collapse;
        ">

            <tr>
                <td style="
                    padding: 12px;
                    border: 1px solid #dddddd;
                    font-weight: bold;
                    width: 150px;
                ">
                    First Name
                </td>

                <td style="
                    padding: 12px;
                    border: 1px solid #dddddd;
                ">
                    ' . htmlspecialchars($fname) . '
                </td>
            </tr>


            <tr>
                <td style="
                    padding: 12px;
                    border: 1px solid #dddddd;
                    font-weight: bold;
                ">
                    Last Name
                </td>

                <td style="
                    padding: 12px;
                    border: 1px solid #dddddd;
                ">
                    ' . htmlspecialchars($lname) . '
                </td>
            </tr>


            <tr>
                <td style="
                    padding: 12px;
                    border: 1px solid #dddddd;
                    font-weight: bold;
                ">
                    Phone
                </td>

                <td style="
                    padding: 12px;
                    border: 1px solid #dddddd;
                ">
                    ' . htmlspecialchars($phone) . '
                </td>
            </tr>


            <tr>
                <td style="
                    padding: 12px;
                    border: 1px solid #dddddd;
                    font-weight: bold;
                ">
                    Email
                </td>

                <td style="
                    padding: 12px;
                    border: 1px solid #dddddd;
                ">
                    ' . htmlspecialchars($email) . '
                </td>
            </tr>


            <tr>
                <td style="
                    padding: 12px;
                    border: 1px solid #dddddd;
                    font-weight: bold;
                    vertical-align: top;
                ">
                    Message
                </td>

                <td style="
                    padding: 12px;
                    border: 1px solid #dddddd;
                ">
                    ' . nl2br(htmlspecialchars($message)) . '
                </td>
            </tr>

        </table>


        <p style="
            margin-top: 25px;
            color: #777777;
            font-size: 14px;
        ">
            This message was sent from your website contact form.
        </p>

    </div>

    ';


    /*
    |--------------------------------------------------------------------------
    | Plain Text Version
    |--------------------------------------------------------------------------
    */

    $mail->AltBody =
        "New Contact Form Submission\n\n" .
        "First Name: " . $fname . "\n" .
        "Last Name: " . $lname . "\n" .
        "Phone: " . $phone . "\n" .
        "Email: " . $email . "\n\n" .
        "Message:\n" . $message;


    /*
    |--------------------------------------------------------------------------
    | Send Email
    |--------------------------------------------------------------------------
    */

    $mail->send();


    /*
    |--------------------------------------------------------------------------
    | IMPORTANT
    |--------------------------------------------------------------------------
    |
    | Your JavaScript checks for exactly "success"
    |
    */

    echo "success";


} catch (Exception $e) {

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    echo "Unable to send message. Please try again later.";

}