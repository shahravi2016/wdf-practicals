<?php
$errors = [];

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    $errors[] = "Invalid request. Please submit the form.";
} else {
    $name = trim($_POST["fullName"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $mobile = trim($_POST["mobile"] ?? "");
    $password = $_POST["password"] ?? "";
    $confirm = $_POST["confirmPassword"] ?? "";
    $course = trim($_POST["course"] ?? "");
    $year = trim($_POST["year"] ?? "");
    $gender = trim($_POST["gender"] ?? "");
    $terms = isset($_POST["terms"]) ? "yes" : "";

    if (!preg_match("/^[A-Za-z ]{2,50}$/", $name)) $errors[] = "Enter a valid name.";
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Enter a valid email.";
    if (!preg_match("/^[6-9][0-9]{9}$/", $mobile)) $errors[] = "Enter a valid 10-digit mobile number.";
    if (strlen($password) < 8) $errors[] = "Password must be 8+ characters.";
    if ($password != $confirm) $errors[] = "Passwords do not match.";
    if ($course == "") $errors[] = "Select a course.";
    if ($year == "") $errors[] = "Select a year.";
    if ($gender == "") $errors[] = "Select gender.";
    if ($terms == "") $errors[] = "Accept terms and conditions.";

    if (empty($errors)) {
        $name = htmlspecialchars($name);
        $email = htmlspecialchars($email);
        $mobile = htmlspecialchars($mobile);
        $course = htmlspecialchars($course);
        $year = htmlspecialchars($year);
        $gender = htmlspecialchars($gender);

        $file = "../data/registrations.json";
        $rows = [];
        if (file_exists($file)) {
            $old = file_get_contents($file);
            $rows = json_decode($old, true) ?? [];
        }
        $rows[] = ["name" => $name, "email" => $email, "mobile" => $mobile,
            "course" => $course, "year" => $year, "gender" => $gender, "date" => date("Y-m-d H:i")];
        file_put_contents($file, json_encode($rows, JSON_PRETTY_PRINT), LOCK_EX);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>StudentHub - Registration Result</title>
    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/layout.css">
    <link rel="stylesheet" href="../css/components.css">
</head>
<body>
<header><nav><a href="../index.html">Home</a> | <a href="../register.html">Register</a></nav></header>
<main><section class="card" style="max-width:500px;margin:2rem auto;padding:1.5rem;">
    <?php if (empty($errors)): ?>
        <h2>Registration Successful</h2>
        <p>Thank you, <?php echo $name; ?>! Your details are saved.</p>
        <a href="../login.html">Go to Login</a>
    <?php else: ?>
        <h2>Please fix these errors</h2>
        <ul><?php foreach ($errors as $e) echo "<li>$e</li>"; ?></ul>
        <a href="../register.html">Go back to form</a>
    <?php endif; ?>
</section></main>
</body>
</html>
