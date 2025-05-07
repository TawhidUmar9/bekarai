import google.generativeai as genai
from sentence_transformers import SentenceTransformer
import chromadb
import psycopg2
from psycopg2.extras import RealDictCursor
import nltk
import os
import re
from nltk.tokenize import sent_tokenize
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Configuration
GEMINI_API_KEY = 'AIzaSyDB5HF5gOMtr4e8hYXFzCDFp-nfaIO77b0'
CHROMA_DB_PATH = './chroma_db'
DB_PASSWORD = 's9dE7Fyh7iNS0Vyx'
SUPABASE_CONNECTION_STRING = "postgresql://postgres.wijfskxklffrhxqmmorm:s9dE7Fyh7iNS0Vyx@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# Init
nltk_data_path = os.path.expanduser("~/.nltk_data")
os.makedirs(nltk_data_path, exist_ok=True)
nltk.data.path.append(nltk_data_path)

#nltk.download('punkt', download_dir=nltk_data_path)
embedder = SentenceTransformer('paraphrase-MiniLM-L6-v2')

chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
user_collection = chroma_client.get_or_create_collection(name="user_profiles")
course_collection = chroma_client.get_or_create_collection(name="courses")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('models/gemini-1.5-flash-001')

try:
    conn = psycopg2.connect(SUPABASE_CONNECTION_STRING)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
except psycopg2.Error as e:
    print(f"Database connection failed: {e}")
    exit(1)

def preprocess_text(text):
    return [s.strip() for s in sent_tokenize(text) if s.strip()]

def parse_user_string(user_data):
    """Converts user data to a formatted string."""
    user_string = f"User ID: {user_data['user_id']}, " \
                  f"Name: {user_data['name']}, " \
                  f"Bio: {user_data['bio']}, " \
                  f"Skills: {', '.join(user_data['skills'])}"
    return user_string


def get_user_details(email):
    """Fetch user_id, name, and bio for the given email."""
    cursor.execute(
        """
        SELECT user_id, name, bio
        FROM "user"
        WHERE email = %s
        """,
        (email,)
    )
    return cursor.fetchone()

def build_user_string(email):
    """Builds the complete user string including skills."""
    user_details = get_user_details(email)
    if not user_details:
        print(f"No user found with email: {email}")
        return ""
    user_id = user_details['user_id']
    name = user_details['name']
    bio = user_details['bio']
    
    # Fetch skills for the user
    cursor.execute(
    """
    SELECT sl.skill_type
    FROM "user" u
    JOIN user_skill_relation usr ON u.user_id = usr.user_id
    JOIN skill_list sl ON usr.skill_id = sl.id
    WHERE u.email = %s
    """,
    (email,)
    )
    skills = [row['skill_type'] for row in cursor.fetchall()]
    skills_str = ";".join(skills)
    
    # Build the user string in the required format
    user_string = f"user_id:{user_id},name:{name},bio:{bio},skills:{skills_str}"
    return {
        'user_id': user_id,
        'name': name,
        'bio': bio,
        'skills': skills
    }













def add_user_to_chromadb(email):
    # user_string = build_user_string(email)
    # if not user_string:
    #     print(f"No user found with email: {email}")
    #     return

    profile_data = build_user_string(email)
    user_id = profile_data['user_id']
    profile_text = f"Name: {profile_data.get('name', '')}. " \
                   f"Skills: {', '.join(profile_data.get('skills', []))}. " \
                   f"Bio: {profile_data.get('bio', '')}"
    
    embedding = embedder.encode([profile_text])[0].tolist()
    
    # Fix metadata type for ChromaDB
    user_collection.upsert(
        ids=[str(user_id)],
        embeddings=[embedding],
        metadatas=[{
            'user_id': profile_data['user_id'],
            'name': profile_data['name'],
            'bio': profile_data['bio'],
            'skills': '; '.join(profile_data['skills'])  # Convert list to string
        }],
        documents=[profile_text]
    )
    print(f"Added user {user_id} to ChromaDB.")


def check_user_in_chromadb(user_id):
    """Check if the user exists in ChromaDB by user_id."""
    try:
        user_id_str = str(user_id)
        print(f"Checking user_id: {user_id_str}")
        results = user_collection.get(ids=[user_id_str], include=["metadatas"])
        print(f"ChromaDB get results for user_id {user_id_str}: {results}")
        
        if results and "metadatas" in results and results["metadatas"]:
            metadata = results["metadatas"][0]  # Single entry for a specific ID
            print(f"Retrieved metadata: {metadata}")
            # Ensure both values are strings for comparison
            if metadata and isinstance(metadata, dict) and str(metadata.get("user_id")) == user_id_str:
                return True
        else:
            print(f"No metadata found for user_id {user_id_str}")
    
    except Exception as e:
        print(f"Error checking user in ChromaDB: {e}")
    
    return False


def parse_course_string(course_string):
    return dict(pair.split(':', 1) for pair in course_string.split(','))



def get_course_details(course_id):
    """Fetch title and description for the given course_id."""
    try:
        cursor.execute(
            """
            SELECT title, description
            FROM course
            WHERE id = %s
            """,
            (course_id,)
        )
        course_details = cursor.fetchone()
        
        if not course_details:
            print(f"No course found with course_id: {course_id}")
            return {}
        
        return {
            "course_id": course_id,
            "title": course_details['title'],
            "description": course_details['description']
        }
    
    except Exception as e:
        print(f"Error fetching course details for course_id {course_id}: {e}")
        return {}




def add_course_to_chromadb(course_id):
    course_data = get_course_details(course_id)
    
    if not course_data:
        print(f"No course found with course_id: {course_id}")
        return
    
    course_text = f"Title: {course_data.get('title', '')}. Description: {course_data.get('description', '')}"
    sentences = preprocess_text(course_text)

    documents, embeddings, metadatas = [], [], []
    for i, sentence in enumerate(sentences):
        documents.append(sentence)
        embeddings.append(embedder.encode([sentence])[0].tolist())
        metadatas.append({
            "type": "course",
            "course_id": course_id,
            "course_title": course_data.get('title', ''),
            "sentence_id": i
        })

    course_collection.upsert(
        ids=[f"course_{course_id}_{i}" for i in range(len(documents))],
        embeddings=embeddings,
        metadatas=metadatas,
        documents=documents
    )
    print(f"Added course {course_id} to ChromaDB.")












def generate_recommendation(user_id, user_prompt, max_words=60):
    try:
        # Fetch user profile from ChromaDB
        user_metadata = user_collection.get(ids=[str(user_id)], include=["metadatas", "documents"])
        #print(f"user_metadata: {user_metadata}")  
        
        if not user_metadata or not user_metadata["documents"]:
            print(f"No profile found for user_id {user_id}")
            return "No profile found."
        
        # Extract metadata correctly
        user_meta = user_metadata["metadatas"][0]
        user_name = user_meta.get("name", "Unknown User")
        user_bio = user_meta.get("bio", "No bio available")
        user_skills = user_meta.get("skills", "No skills listed")
        
        # Combine profile with user prompt
        user_text = f"User Profile: {user_name}. Bio: {user_bio}. Skills: {user_skills}. {user_prompt}"
        user_embedding = embedder.encode([user_text])[0].tolist()
    except Exception as e:
        print(f"Error fetching user profile from ChromaDB: {e}")
        return "Error fetching user profile."
    
    try:
        # Fetch all courses from ChromaDB for matching
        course_documents = course_collection.get(include=["documents", "metadatas", "embeddings"])
        course_embeddings = course_documents["embeddings"]
        course_metadatas = course_documents["metadatas"]
    except Exception as e:
        print(f"Error fetching courses from ChromaDB: {e}")
        return "Error fetching courses."
    
    try:
        # Calculate similarity
        user_embedding_np = np.array([user_embedding])
        course_embeddings_np = np.array(course_embeddings)
        similarities = cosine_similarity(user_embedding_np, course_embeddings_np)[0]
        
        # Get the top 3 most relevant courses
        top_indices = np.argsort(similarities)[-3:][::-1]
        top_courses = [course_metadatas[i] for i in top_indices]
        
        # Build the final recommendation prompt
        course_list = ", ".join([f"{course['course_title']} (ID: {course['course_id']})" for course in top_courses])
        
        # Construct the final prompt
        final_prompt = (
            f"User Profile: {user_name}, Bio: {user_bio}, Skills: {user_skills}.\n\n"
            f"Recommended Courses:\n{course_list}\n\n"
            f"User Query: {user_prompt}\n\n"
            "Provide a concise recommendation that matches the user's skills and interests from the above courses."
        )
        
        # Generate concise recommendation
        response = model.generate_content(
            final_prompt,
            generation_config={
                "temperature": 0.7,
                "max_output_tokens": max_words
            }
        )
        
        # Format the recommendation text
        recommendation_text = response.text.strip()
        match = re.search(r"\(ID: (\d+)\)", recommendation_text)
        course_id = match.group(1) if match else None
        
        return {"text": recommendation_text, "course_id": course_id}
    except Exception as e:
        print(f"Error generating recommendation: {e}")
        return {"text": "Error generating recommendation.", "course_id": None}









def generate_job_recommendation(user_id, user_prompt, max_words=60):
    try:
        # Fetch user profile from ChromaDB
        user_metadata = user_collection.get(ids=[str(user_id)], include=["metadatas", "documents"])
        #print(f"user_metadata: {user_metadata}")  
        
        if not user_metadata or not user_metadata["documents"]:
            print(f"No profile found for user_id {user_id}")
            return {"text": "No profile found.", "job_id": None}
        
        # Extract metadata correctly
        user_meta = user_metadata["metadatas"][0]
        user_name = user_meta.get("name", "Unknown User")
        user_bio = user_meta.get("bio", "No bio available")
        user_skills = user_meta.get("skills", "No skills listed")
        
        # Fetch matching job details from the database
        try:
            conn = psycopg2.connect(SUPABASE_CONNECTION_STRING)
            cursor = conn.cursor(cursor_factory=RealDictCursor)

            # Get job IDs based on matching skills
            cursor.execute("""
                SELECT j.id, j.job_position, j.company_title, j.job_requirements
                FROM jobs j
                JOIN job_skill_relation jsr ON j.id = jsr.job_id
                JOIN user_skill_relation usr ON jsr.skill_id = usr.skill_id
                WHERE usr.user_id = %s
                GROUP BY j.id
            """, (user_id,))
            
            job_results = cursor.fetchall()
            cursor.close()
            conn.close()
            
            if not job_results:
                return {"text": "No matching jobs found.", "job_id": None}
            
        except Exception as e:
            print(f"Database error: {e}")
            return {"text": "Error fetching jobs from the database.", "job_id": None}
        
        # Build the final recommendation prompt
        job_list = ", ".join([f"{job['job_position']} at {job['company_title']} (ID: {job['id']})" for job in job_results])
        job_details = " | ".join([f"Company: {job['company_title']}, Position: {job['job_position']}, Requirements: {job['job_requirements']}" for job in job_results])
        
        # Construct the final prompt
        user_text = f"User Profile: {user_name}, Bio: {user_bio}, Skills: {user_skills}.\n\nUser Query: {user_prompt}\n\n"
        final_prompt = (
            f"{user_text}Recommended Jobs:\n{job_list}\n\n"
            "Provide a concise recommendation that matches interests with the job requirements."
        )
        
        # Generate concise recommendation
        response = model.generate_content(
            final_prompt,
            generation_config={
                "temperature": 0.7,
                "max_output_tokens": max_words
            }
        )
        
        # Extract the job ID from the generated text
        recommendation_text = response.text.strip()
        match = re.search(r"\(ID: (\d+)\)", recommendation_text)
        job_id = match.group(1) if match else None
        
        return {"text": recommendation_text, "job_id": job_id}
    except Exception as e:
        print(f"Error generating recommendation: {e}")
        return {"text": "Error generating recommendation.", "job_id": None}
    
    


if __name__ == "__main__":
    import sys
    
    action = sys.argv[1]

    try:
        # Database connection
        conn = psycopg2.connect(SUPABASE_CONNECTION_STRING)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

       
        
       

        if action == 'gen_user_string':
            email = sys.argv[2]
            user_string = build_user_string(email)
            if user_string:
                print("\nGenerated User String:")
                print(user_string)
            else:
                print("\nUser not found or no skills associated.")
        elif action == 'add_user_to_chromadb':
            email = sys.argv[2]
            add_user_to_chromadb(email)
            
            # Check if user is added to ChromaDB
            user_details = get_user_details(email)
            if user_details:
                user_id = user_details['user_id']
                if check_user_in_chromadb(user_id):
                    print(f"User {user_id} has been successfully added to ChromaDB.")
                else:
                    print(f"User {user_id} was not found in ChromaDB.")
        elif action == 'add_course_to_chromadb':
            course_id = sys.argv[2]
            add_course_to_chromadb(course_id)
            
            # Check if course is added to ChromaDB
            course_details = get_course_details(course_id)
            if course_details:
                course_id = course_details['course_id']
                print(f"Course {course_id} has been successfully added to ChromaDB.")
            else:
                print(f"Course {course_id} was not found in ChromaDB.")
        elif action == 'test_recommendation':
            user_id = sys.argv[2]  # User ID for recommendation test
            user_prompt = sys.argv[3]  # User prompt for the query (e.g., "I need a course in Data Science")
            
            # Call the recommendation function
            recommendation = generate_recommendation(user_id, user_prompt)
            print("\nGenerated Recommendation:")
            print(recommendation)
        elif action == 'test_job_recommendation':
            user_id = sys.argv[2]
            user_prompt = sys.argv[3]
            recommendation = generate_job_recommendation(user_id, user_prompt)
            print("\nGenerated Job Recommendation:")
            print(recommendation)
        else:
            print("Invalid action. Use 'signup', 'add_course', 'query', or 'gen_user_string'.")
    
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    
    finally:
        cursor.close()
        conn.close()
        
        
        
