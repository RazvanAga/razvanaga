# Google Sheets API Configuration

## Deployment Information

**Deployment Date**: 30 decembrie 2025, 16:03
**Version**: 1
**Status**: Successfully updated

## Credentials

**Deployment ID**:
```
AKfycbwOBKQ4Vwpl2e5ds23gf7-MvLbCF7a7QPARbG60A5ZNnA0YOCnII0mEj4_KcYuV0dQH
```

**Web App URL** (API Endpoint):
```
https://script.google.com/macros/s/AKfycbwOBKQ4Vwpl2e5ds23gf7-MvLbCF7a7QPARbG60A5ZNnA0YOCnII0mEj4_KcYuV0dQH/exec
```

## Usage

Acest URL este folosit pentru a trimite datele formularului de RSVP către Google Sheets.

### Request Format
- **Method**: POST
- **Content-Type**: application/json
- **Body**:
```json
{
  "guests": [
    {
      "lastName": "Popescu",
      "firstName": "Ion",
      "ageCategory": "adult",
      "menu": "meat"
    }
  ]
}
```

### Response Format
```json
{
  "status": "success",
  "message": "Data saved successfully"
}
```

## Google Sheet Structure

Coloanele în Google Sheet:
1. **A**: Timestamp (auto-generated)
2. **B**: Nume (lastName)
3. **C**: Prenume (firstName)
4. **D**: Categorie (ageCategory: adult/child)
5. **E**: Meniu (menu: meat/vegetarian)

## Notes

- Access: Anyone with the URL can submit data
- Execute as: Owner (Razvan)
- No authentication required for submissions
