from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Subject, Note
from .serializers import SubjectSerializer, NoteSerializer


# -----------------------------
# Subject APIs
# -----------------------------

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def subject_list(request):

    if request.method == "GET":
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

    serializer = SubjectSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# Note APIs
# -----------------------------

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def note_list(request):

    if request.method == "GET":
        notes = Note.objects.all().order_by("-uploaded_at")
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    serializer = NoteSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# Delete Note
# -----------------------------

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_note(request, pk):

    try:
        note = Note.objects.get(pk=pk)

    except Note.DoesNotExist:
        return Response(
            {"error": "Note not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    note.delete()

    return Response(
        {"message": "Note deleted successfully"},
        status=status.HTTP_204_NO_CONTENT
    )