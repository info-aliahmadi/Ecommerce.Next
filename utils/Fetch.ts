
export default class Fetch {
  static SetDefaultHeader(
    token?: string,
    contentType: string = 'application/json',
    language: string = 'fa',
  ): RequestInit {

    let config: RequestInit = {
      headers: {
        Accept: 'application/json',
        'Content-Type': contentType,
        'Accept-Language': language,
      },
    };
    if (token) {
      let tokenBearer: string = token ? 'Bearer ' + token : '';
      config.headers = {
        ...config.headers,
        Authorization: tokenBearer,
      };
    }

    return config;
  }

  static async Get<T>(url: string, config?: RequestInit): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          ...config,
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            reject(new Error('Access denied. You are not allowed to do this.'));
            return;
          }
          reject(
            new Error(`GET request failed with status: ${response.status}`),
          );
        }

        const data = await response.json();
        resolve(data as T);
      } catch (error) {
        //console.error('Error in GET request:', error);
        reject(error);
      }
    });
  }

  static async Post<T>(
    url: string,
    body?: any,
    config?: RequestInit,
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            ...config?.headers,
          },
          body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
          ...config,
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            reject(new Error('Access denied. You are not allowed to do this.'));
            return;
          }
          const errorText = await response.json();
          reject(errorText as T);
        }

        const data = await response.json();
        resolve(data as T);
      } catch (error) {
        reject(error);
      }
    });
  }

  static async Delete<T>(url: string, config?: RequestInit): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          ...config,
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            reject(new Error('Access denied. You are not allowed to do this.'));
            return;
          }
          const errorText = await response.json();
          resolve(errorText as T);
        }

        const data = await response.json();
        resolve(data as T);
      } catch (error) {
        reject(error as T);
      }
    });
  }

  static async PostFile(
    url: string,
    body?: any,
    config?: RequestInit,
    fileName?: string,
  ): Promise<void> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...config?.headers,
      },
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      ...config,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. You are not allowed to do this.');
      }

      const errorText = await response.text();
      throw new Error(errorText);
    }

    const blob = await response.blob();


    const urlBlob = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = urlBlob;
    link.download = fileName ?? `file.pdf`; // اسم فایل
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(urlBlob);
  }
}
