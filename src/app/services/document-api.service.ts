import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DocumentItem {
    id: number;
    name: string;
    type: string;
    description: string;
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