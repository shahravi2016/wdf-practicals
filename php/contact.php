<?php
$errors = [];

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    $errors[] = "Invalid request. Please submit the form.";
} else {
    $name = trim($_POST["name"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $subject = trim($_POST["subject"] ?? "");
    $message = trim($_POST["message"] ?? "");

    if (strlen($name) < 2) $errors[] = "Enter your name.";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Enter a valid email.";
    if ($subject == "") $errors[] = "Select a subject.";
    if (strlen($message) < 5) $errors[] = "Message is too short.";

    if (empty($errors)) {
        $name = htmlspecialchars($name);
        $email = htmlspecialchars($email);
        $subject = htmlspecialchars($subject);
        $message = htmlspecialchars($message);

        $file = "../data/messages.json";
        $rows = [];
        if (file_exists($file)) {
            $old = file_get_contents($file);
            $rows = json_decode($old, true) ?? [];
        }
        $rows[] = ["name" => $name, "email" => $email, "subject" => $subject,
            "message" => $message, "date" => date("Y-m-d H:i")];
        file_put_contents($file, json_encode($rows, JSON_PRETTY_PRINT), LOCK_EX);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>StudentHub - Message Result</title>
    <link rel="stylesheet" href="../css/variables.css">
    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/layout.css">
    <link rel="stylesheet" href="../css/components.css">
    <link rel="stylesheet" href="../css/pages.css">
    <link rel="stylesheet" href="../css/theme.css">
    <link rel="stylesheet" href="../css/utils.css">
</head>
<body>
<header>
    <nav>
        <div class="logo">StudentHub</div>
        <ul class="nav-links">
            <li><a href="../index.html">Home</a></li>
            <li><a href="../about.html">About</a></li>
            <li><a href="../events.html">Events</a></li>
            <li><a href="../notices.html">Notices</a></li>
            <li><a href="../faq.html">FAQ</a></li>
            <li><a href="../contact.html">Contact</a></li>
            <li><a href="../login.html">Login</a></li>
            <li><a href="../register.html">Register</a></li>
        </ul>
    </nav>
</header>
<main>
<section class="page-header"><h1>Contact</h1></section>
<section class="contact-form-section">
<div class="card">
    <?php if (empty($errors)): ?>
        <h2>Message Sent</h2>
        <p>Thank you, <?php echo $name; ?>! We will reply soon.</p>
        <a href="../index.html">Back to Home</a>
    <?php else: ?>
        <h2>Please fix these errors</h2>
        <ul><?php foreach ($errors as $e) echo "<li>$e</li>"; ?></ul>
        <a href="../contact.html">Go back to form</a>
    <?php endif; ?>
</div>
</section>
</main>
<footer>
    <p>&copy; 2026 StudentHub | <a href="../contact.html">Contact</a> | <a href="#">Privacy Policy</a></p>
</footer>
<script src="../js/script.js"></script>
</body>
</html>
