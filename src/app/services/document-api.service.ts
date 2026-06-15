import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DocumentItem {
    id: number;
    name: string;
    original_name?: string;
    type: string;
    size?: number;
    file_path?: string;
    folder_id?: number;
    owner_id?: number;
    description: string;
    is_favorite?: boolean;
    created_at?: string;
    updated_at?: string;
    folder_name?: string;
    owner_name?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DocumentApiService {

    private apiUrl = 'http://localhost:3000/api/documents';

    constructor(private http: HttpClient) { }

    getDocuments(): Observable<DocumentItem[]> {
        return this.http.get<DocumentItem[]>(this.apiUrl);
    }
}