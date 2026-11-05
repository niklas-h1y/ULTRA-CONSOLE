# Permissions checklist

Request only the permissions your extension needs and explain each one to users.

- `storage`: used by the example settings page.
- `activeTab`: add only when a user gesture needs temporary access to the active tab.
- `scripting`: add only when using the scripting API.
- `tabs`: add only when reading tab metadata that other APIs do not provide.
- `contextMenus`: add only when creating context menu items.
- `host_permissions`: add only for specific sites the extension must access.

Remove unused permissions before publishing. Consider optional permissions for features that do not need access at install time.
