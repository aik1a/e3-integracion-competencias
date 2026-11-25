package cl.aikia.asistencia;

import android.app.Activity;
import android.app.AlertDialog;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends Activity {
    private final ExecutorService network = Executors.newSingleThreadExecutor();
    private final Uri server = Uri.parse(BuildConfig.SERVER_URL);
    private WebView webView;
    private View statusPanel;
    private View progress;
    private View retry;
    private TextView statusText;
    private boolean pageFailed;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        findViewById(R.id.root).setOnApplyWindowInsetsListener((view, insets) -> {
            view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        webView = findViewById(R.id.webview);
        statusPanel = findViewById(R.id.status_panel);
        progress = findViewById(R.id.progress);
        retry = findViewById(R.id.retry);
        statusText = findViewById(R.id.status_text);
        configureWebView();
        retry.setOnClickListener(view -> connect());
        connect();
    }

    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true); // Las confirmaciones de E2 usan confirm().
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        webView.setImportantForAutofill(View.IMPORTANT_FOR_AUTOFILL_NO_EXCLUDE_DESCENDANTS);
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, false);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !sameOrigin(request.getUrl());
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (sameOrigin(request.getUrl())) return null;
                return new WebResourceResponse("text/plain", "UTF-8", 403, "Forbidden",
                        java.util.Collections.emptyMap(), new java.io.ByteArrayInputStream(new byte[0]));
            }

            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap icon) {
                pageFailed = false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                if (!pageFailed) {
                    statusPanel.setVisibility(View.GONE);
                    webView.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) showError();
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse response) {
                if (request.isForMainFrame() && response.getStatusCode() >= 500) showError();
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
                if (!sameOrigin(Uri.parse(url))) {
                    result.cancel();
                    return true;
                }
                new AlertDialog.Builder(MainActivity.this)
                        .setTitle(R.string.confirm_title)
                        .setMessage(message)
                        .setPositiveButton(R.string.accept, (dialog, which) -> result.confirm())
                        .setNegativeButton(R.string.cancel, (dialog, which) -> result.cancel())
                        .setOnCancelListener(dialog -> result.cancel())
                        .show();
                return true;
            }
        });
    }

    private boolean sameOrigin(Uri uri) {
        return server.getScheme().equals(uri.getScheme())
                && server.getHost().equals(uri.getHost()) && server.getPort() == uri.getPort();
    }

    private void connect() {
        statusPanel.setVisibility(View.VISIBLE);
        webView.setVisibility(View.GONE);
        progress.setVisibility(View.VISIBLE);
        retry.setVisibility(View.GONE);
        statusText.setText(R.string.checking_server);
        network.execute(() -> {
            HttpURLConnection connection = null;
            boolean available = false;
            try {
                connection = (HttpURLConnection) new URL(BuildConfig.SERVER_URL + "/salud").openConnection();
                connection.setConnectTimeout(5000);
                connection.setReadTimeout(5000);
                connection.setInstanceFollowRedirects(false);
                available = connection.getResponseCode() == 200;
            } catch (Exception ignored) {
                // El error se presenta en la pantalla con opción de reintentar.
            } finally {
                if (connection != null) connection.disconnect();
            }
            final boolean serverAvailable = available;
            runOnUiThread(() -> {
                if (isFinishing() || isDestroyed()) return;
                if (serverAvailable) webView.loadUrl(BuildConfig.SERVER_URL + "/");
                else showError();
            });
        });
    }

    private void showError() {
        pageFailed = true;
        webView.setVisibility(View.GONE);
        statusPanel.setVisibility(View.VISIBLE);
        progress.setVisibility(View.GONE);
        retry.setVisibility(View.VISIBLE);
        statusText.setText(R.string.server_error);
    }

    @Override
    public void onBackPressed() {
        if (webView.getVisibility() == View.VISIBLE && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        network.shutdownNow();
        webView.stopLoading();
        webView.destroy();
        super.onDestroy();
    }
}
